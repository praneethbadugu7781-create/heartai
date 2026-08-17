import torch
import torch.nn as nn


class HeartMLP(nn.Module):
    """
    Multi-Layer Perceptron (MLP) baseline model for heart disease risk estimation.
    Designed with a compact two-hidden-layer structure using LeakyReLU activations
    and L2 regularization to contrast with the deeper DNN architecture.
    """
    def __init__(self, input_dim: int = 13, hidden_dim1: int = 32, hidden_dim2: int = 16, dropout_rate: float = 0.15):
        super(HeartMLP, self).__init__()
        self.input_dim = input_dim
        
        self.layer1 = nn.Linear(input_dim, hidden_dim1)
        self.act1 = nn.LeakyReLU(negative_slope=0.1)
        self.drop1 = nn.Dropout(p=dropout_rate)
        
        self.layer2 = nn.Linear(hidden_dim1, hidden_dim2)
        self.act2 = nn.LeakyReLU(negative_slope=0.1)
        
        self.out_layer = nn.Linear(hidden_dim2, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.layer1(x)
        x = self.act1(x)
        x = self.drop1(x)
        
        x = self.layer2(x)
        x = self.act2(x)
        
        x = self.out_layer(x)
        x = self.sigmoid(x)
        return x

    def get_feature_importance(self, x: torch.Tensor) -> torch.Tensor:
        """
        Calculate weight-gradient attribution for MLP interpretability.
        """
        self.eval()
        x = x.clone().detach().requires_grad_(True)
        out = self.forward(x)
        grad = torch.autograd.grad(out.sum(), x, retain_graph=False, create_graph=False)[0]
        attribution = torch.abs(grad * x).mean(dim=0)
        if attribution.sum() > 0:
            attribution = attribution / attribution.sum()
        return attribution.detach()
