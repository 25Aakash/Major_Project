"""
Kaggle Dataset Loader for NeuroLearn
Downloads and preprocesses real datasets for ML training
Author: Aakash Khandelwal
"""

import os
import sys

def check_kaggle_setup():
    """Check if Kaggle API is configured"""
    print("="*70)
    print("  Kaggle Setup Checker")
    print("="*70)
    
    # Check if kaggle package is installed
    try:
        import kaggle
        print("\n✓ Kaggle package is installed")
    except ImportError:
        print("\n✗ Kaggle package not found")
        print("\nTo install: pip install kaggle")
        return False
    
    # Check for API credentials
    kaggle_dir = os.path.expanduser("~/.kaggle")
    kaggle_json = os.path.join(kaggle_dir, "kaggle.json")
    
    if os.path.exists(kaggle_json):
        print(f"✓ Kaggle credentials found at: {kaggle_json}")
        return True
    else:
        print(f"\n✗ Kaggle credentials not found at: {kaggle_json}")
        print("\nSetup Instructions:")
        print("1. Go to https://www.kaggle.com/settings")
        print("2. Scroll to 'API' section")
        print("3. Click 'Create New API Token'")
        print("4. Download kaggle.json")
        print(f"5. Move kaggle.json to: {kaggle_dir}")
        print(f"   Windows: {os.path.expanduser('~\\.kaggle\\kaggle.json')}")
        print(f"   Mac/Linux: ~/.kaggle/kaggle.json")
        return False

def download_datasets():
    """Download all required datasets from Kaggle"""
    print("\n" + "="*70)
    print("  Downloading Kaggle Datasets")
    print("="*70)
    
    datasets = [
        {
            'name': 'Autism Screening',
            'id': 'faizunnabi/autism-screening',
            'folder': 'autism',
            'problem': 'Autism Spectrum Disorder'
        },
        {
            'name': 'xAPI Educational Data',
            'id': 'aljarah/xAPI-Edu-Data',
            'folder': 'educational',
            'problem': 'ADHD & General Learning'
        },
        {
            'name': 'Student Performance',
            'id': 'spscientist/students-performance-in-exams',
            'folder': 'performance',
            'problem': 'Dyscalculia'
        },
        {
            'name': 'Student Adaptivity',
            'id': 'mdmahmudulhasansuzan/students-adaptability-level-in-online-education',
            'folder': 'adaptivity',
            'problem': 'ADHD & Engagement'
        }
    ]
    
    # Create datasets directory
    os.makedirs('datasets', exist_ok=True)
    
    import kaggle
    
    for dataset in datasets:
        print(f"\n📥 Downloading: {dataset['name']}")
        print(f"   Problem: {dataset['problem']}")
        print(f"   Dataset ID: {dataset['id']}")
        
        try:
            # Download dataset
            kaggle.api.dataset_download_files(
                dataset['id'],
                path=f"datasets/{dataset['folder']}",
                unzip=True
            )
            print(f"   ✓ Downloaded to: datasets/{dataset['folder']}/")
        except Exception as e:
            print(f"   ✗ Error: {e}")
            print(f"   Try manually: kaggle datasets download -d {dataset['id']}")
    
    print("\n" + "="*70)
    print("  Download Complete!")
    print("="*70)
    print("\nDataset locations:")
    print("  - datasets/autism/          (Autism screening)")
    print("  - datasets/educational/     (ADHD indicators)")
    print("  - datasets/performance/     (Dyscalculia)")
    print("  - datasets/adaptivity/      (Engagement)")

def list_downloaded_datasets():
    """List all downloaded datasets"""
    print("\n" + "="*70)
    print("  Downloaded Datasets")
    print("="*70)
    
    if not os.path.exists('datasets'):
        print("\n✗ No datasets folder found")
        return
    
    for folder in os.listdir('datasets'):
        folder_path = os.path.join('datasets', folder)
        if os.path.isdir(folder_path):
            files = os.listdir(folder_path)
            print(f"\n📁 {folder}/")
            for file in files:
                file_path = os.path.join(folder_path, file)
                size_mb = os.path.getsize(file_path) / (1024 * 1024)
                print(f"   - {file} ({size_mb:.2f} MB)")

def main():
    print("\n" + "*"*70)
    print("  NEUROLEARN KAGGLE DATASET SETUP")
    print("*"*70)
    
    # Check if Kaggle is set up
    if not check_kaggle_setup():
        print("\n⚠ Please set up Kaggle API credentials first!")
        print("Follow the instructions above, then run this script again.")
        return
    
    print("\n✓ Kaggle is configured correctly!")
    
    # Ask user if they want to download
    print("\nReady to download 4 datasets (total ~50 MB)")
    print("Datasets:")
    print("  1. Autism Screening (996 samples)")
    print("  2. xAPI Educational Data (480 students)")
    print("  3. Student Performance (1000 students)")
    print("  4. Student Adaptivity (1205 students)")
    
    response = input("\nDownload datasets? (yes/no): ").strip().lower()
    
    if response in ['yes', 'y']:
        download_datasets()
        list_downloaded_datasets()
        
        print("\n✓ All datasets ready for training!")
        print("\nNext steps:")
        print("  1. Run: python preprocess_kaggle_data.py")
        print("  2. Then: python train_with_kaggle.py")
    else:
        print("\n✓ Skipped download")
        
        # Check what's already downloaded
        if os.path.exists('datasets'):
            list_downloaded_datasets()

if __name__ == "__main__":
    main()
