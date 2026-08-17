import os
import sys

# Ensure backend root is on sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.ml.training import train_heart_models

if __name__ == "__main__":
    dataset_csv = os.path.join(backend_dir, "app", "artifacts", "dataset", "heart.csv")
    artifacts_dir = os.path.join(backend_dir, "app", "artifacts")

    print(f"==================================================")
    print(f"HeartGuard AI — ML Model Training Pipeline")
    print(f"Dataset: {dataset_csv}")
    print(f"Artifacts output: {artifacts_dir}")
    print(f"==================================================")

    if not os.path.exists(dataset_csv):
        print(f"Error: Dataset file not found at {dataset_csv}")
        sys.exit(1)

    report = train_heart_models(
        dataset_path=dataset_csv,
        output_dir=artifacts_dir,
        epochs=120,
        batch_size=32,
        seed=42
    )

    print("\n--- Model Performance Summary on Held-Out Test Set ---")
    for m in report["metrics_summary"]:
        print(f"Model: {m['model_name']:<30} | Acc: {m['accuracy']*100:.1f}% | Prec: {m['precision']*100:.1f}% | Rec: {m['recall_sensitivity']*100:.1f}% | F1: {m['f1_score']*100:.1f}% | ROC-AUC: {m['roc_auc']:.3f}")
    print("==================================================")
