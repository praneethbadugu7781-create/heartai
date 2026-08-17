import torch
import torch.nn as nn
from typing import Dict, Any


class HeartDNN(nn.Module):
    """
    Deep Neural Network for Tabular Heart Disease Risk Assessment.
    Features multiple dense layers with Batch Normalization and Dropout regularization
    to prevent overfitting on clinical tabular features.
    """
    def __init__(self, input_dim: int = 13, hidden_dims: list = None, dropout_rate: float = 0.25):
        super(HeartDNN, self).__init__()
        if hidden_dims is None:
            hidden_dims = [64, 32, 16]
            
        self.input_dim = input_dim
        layers = []
        prev_dim = input_dim
        
        for i, h_dim in enumerate(hidden_dims):
            layers.append(nn.Linear(prev_dim, h_dim))
            layers.append(nn.BatchNorm1d(h_dim))
            layers.append(nn.ReLU())
            if i < len(hidden_dims) - 1:
                layers.append(nn.Dropout(dropout_rate))
            prev_dim = h_dim
            
        # Final classification output
        layers.append(nn.Linear(prev_dim, 1))
        layers.append(nn.Sigmoid())
        
        self.network = nn.Sequential(*layers)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.network(x)

    def get_feature_importance(self, x: torch.Tensor) -> torch.Tensor:
        """
        Calculate gradient-based input feature attribution (Saliency) for explainability.
        """
        self.eval()
        x = x.clone().detach().requires_grad_(True)
        out = self.forward(x)
        grad = torch.autograd.grad(out.sum(), x, retain_graph=False, create_graph=False)[0]
        attribution = torch.abs(grad * x).mean(dim=0)
        # Normalize
        if attribution.sum() > 0:
            attribution = attribution / attribution.sum()
        return attribution.detach()
