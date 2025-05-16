# -*- coding:utf-8 -*-
import os
from PIL import Image
import numpy as np

import torch
from torch.utils import data
from torchvision import transforms as T


class NormSingleROI(object):
    """
    Normalize the input image (exclude the black region) with 0 mean and 1 std.
    [c,h,w]
    """
    def __init__(self, outchannels=1):
        self.outchannels = outchannels

    def __call__(self, tensor):

        c,h,w = tensor.size()

        if c != 1:
            raise TypeError('only support grayscale image.')

        tensor = tensor.view(c, h*w)
        idx = tensor > 0
        t = tensor[idx]

        m = t.mean()
        s = t.std() 
        t = t.sub_(m).div_(s+1e-6)
        tensor[idx] = t
        
        tensor = tensor.view(c, h, w)

        if self.outchannels > 1:
            tensor = torch.repeat_interleave(tensor, repeats = self.outchannels, dim = 0)
    
        return tensor


class MyDataset(data.Dataset):
    '''
    Load and process the ROI images::

    INPUT::
    txt: a text file containing paths & labels of the input images \n
    transforms: None 
    train: True for a training set, and False for a testing set
    imside: the image size of the output image [imside x imside]
    outchannels: 1 for grayscale image, and 3 for RGB image

    OUTPUT::
    [batch, outchannels, imside, imside]
    '''
    
    def __init__(self, txt, transforms=None, train=True, imside=128, outchannels=1):        

        self.train = train
        self.imside = imside # 128, 224
        self.chs = outchannels # 1, 3
        self.text_path = txt        
        self.transforms = transforms

        if transforms is None:
            common_transforms = [
                T.Resize((self.imside, self.imside)),
                T.ToTensor(),
                NormSingleROI(outchannels=self.chs)
            ]
            
            if not train:
                self.transforms = T.Compose(common_transforms)
            else:
                train_transforms = [
                    T.RandomChoice(transforms=[
                        T.ColorJitter(contrast=0.05),
                        T.RandomResizedCrop(size=self.imside, scale=(0.8,1.0), ratio=(1.0, 1.0)),
                        T.RandomPerspective(distortion_scale=0.15, p=1),
                        T.RandomChoice(transforms=[
                            T.RandomRotation(degrees=10, expand=False, center=(0.5*self.imside, 0.0)),
                            T.RandomRotation(degrees=10, expand=False, center=(0.0, 0.5*self.imside)),
                        ]),
                    ])
                ]
                self.transforms = T.Compose(train_transforms + common_transforms)

        self._read_txt_file()

    def _read_txt_file(self):
        self.images_path = []
        self.images_label = []

        with open(self.text_path, 'r') as f:
            lines = f.readlines()
            for line in lines:
                item = line.strip().split(' ')
                self.images_path.append(item[0])
                self.images_label.append(item[1])

    def __getitem__(self, index):
        img_path = self.images_path[index]
        label = self.images_label[index]

        # Print the path of the first image being loaded
        #print(f"Loading image: {img_path}")

        # Check if the first image file exists
        if not os.path.exists(img_path):
            print(f"File not found: {img_path}")
            raise FileNotFoundError(f"Image file not found: {img_path}")

        idx2 = np.random.choice(np.arange(len(self.images_label))[np.array(self.images_label) == label])

        if self.train:
            while idx2 == index:
                idx2 = np.random.choice(np.arange(len(self.images_label))[np.array(self.images_label) == label])
        else:
            idx2 = index

        img_path2 = self.images_path[idx2]

        # Print the path of the second image being loaded
        # print(f"Loading image: {img_path2}")

        # Check if the second image file exists
        if not os.path.exists(img_path2):
            print(f"File not found: {img_path2}")
            raise FileNotFoundError(f"Image file not found: {img_path2}")

        data = Image.open(img_path).convert('L')     
        data = self.transforms(data)    

        data2 = Image.open(img_path2).convert('L')
        data2 = self.transforms(data2)

        data = [data, data2]
        return data, int(label)
        
    def __len__(self):
        return len(self.images_path)
