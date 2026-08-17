import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Tuple, List


class GLUBlock(nn.Module):
    """
    Gated Linear Unit block with Ghost BatchNorm and residual connection.
    """
    def __init__(self, input_dim: int, output_dim: int):
        super(GLUBlock, self).__init__()
        self.fc = nn.Linear(input_dim, output_dim * 2)
        self.bn = nn.BatchNorm1d(output_dim * 2)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        out = self.fc(x)
        out = self.bn(out)
        val, gate = torch.chunk(out, 2, dim=-1)
        return val * torch.sigmoid(gate)


class TabNetDecisionStep(nn.Module):
    """
    Single decision step in TabNet architecture with Attentive Transformer and Feature Transformer.
    """
    def __init__(self, input_dim: int, feature_dim: int, output_dim: int, gamma: float = 1.3):
        super(TabNetDecisionStep, self).__init__()
        self.input_dim = input_dim
        self.gamma = gamma
        
        # Attentive transformer generates sparse feature mask
        self.attn_fc = nn.Linear(feature_dim, input_dim)
        self.attn_bn = nn.BatchNorm1d(input_dim)
        
        # Feature transformer
        self.glu1 = GLUBlock(input_dim, feature_dim)
        self.glu2 = GLUBlock(feature_dim, feature_dim)
        self.out_fc = nn.Linear(feature_dim, output_dim)

    def forward(self, x: torch.Tensor, prior_mask: torch.Tensor, prev_features: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        # Attentive transformer
        attn = self.attn_fc(prev_features)
        attn = self.attn_bn(attn)
        attn = attn * prior_mask
        mask = F.softmax(attn, dim=-1)  # Sparse feature selection mask
        
        # Apply mask to input features
        masked_x = x * mask
        
        # Transform selected features
        h1 = self.glu1(masked_x)
        h2 = self.glu2(h1)
        out = self.out_fc(h2)
        
        # Update prior mask to discourage picking already-used features
        new_prior = prior_mask * (self.gamma - mask)
        
        return out, mask, new_prior, h2


class HeartTabNet(nn.Module):
    """
    TabNet for Tabular Heart Disease Risk Assessment.
    Uses sequential multi-step attention to select relevant clinical features
    and produces interpretable attention masks for transparent XAI explanations.
    """
    def __init__(self, input_dim: int = 13, num_steps: int = 3, feature_dim: int = 32, output_dim: int = 16, gamma: float = 1.3):
        super(HeartTabNet, self).__init__()
        self.input_dim = input_dim
        self.num_steps = num_steps
        self.feature_dim = feature_dim
        self.gamma = gamma
        
        self.initial_bn = nn.BatchNorm1d(input_dim)
        self.initial_glu = GLUBlock(input_dim, feature_dim)
        
        self.steps = nn.ModuleList([
            TabNetDecisionStep(input_dim, feature_dim, output_dim, gamma)
            for _ in range(num_steps)
        ])
        
        self.final_classifier = nn.Sequential(
            nn.Linear(output_dim * num_steps, 16),
            nn.ReLU(),
            nn.Linear(16, 1),
            nn.Sigmoid()
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        out, _ = self.forward_with_masks(x)
        return out

    def forward_with_masks(self, x: torch.Tensor) -> Tuple[torch.Tensor, List[torch.Tensor]]:
        batch_size = x.size(0)
        norm_x = self.initial_bn(x)
        h_prev = self.initial_glu(norm_x)
        prior_mask = torch.ones(batch_size, self.input_dim, device=x.device)
        
        step_outputs = []
        masks = []
        
        for step in self.steps:
            step_out, mask, prior_mask, h_prev = step(norm_x, prior_mask, h_prev)
            step_outputs.append(step_out)
            masks.append(mask)
            
        combined = torch.cat(step_outputs, dim=-1)
        pred = self.final_classifier(combined)
        return pred, masks

    def get_feature_importance(self, x: torch.Tensor) -> torch.Tensor:
        """
        Extract aggregate attention importance score across all decision steps.
        """
        self.eval()
        with torch.no_grad():
            _, masks = self.forward_with_masks(x)
            # Sum attention weights across decision steps and batch
            aggregate_mask = torch.stack(masks, dim=0).sum(dim=0).mean(dim=0)
            if aggregate_mask.sum() > 0:
                aggregate_mask = aggregate_mask / aggregate_mask.sum()
            return aggregate_mask
