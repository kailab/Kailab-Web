<?php

namespace Kailab\Bundle\SharedBundle\Asset;

interface AssetStorageInterface
{
    public function readAsset($name, $namespace);
    public function deleteAsset($name, $namespace);
    public function hasAsset($name, $namespace);
    /**
     * 
     * Enter description here ...
     * @param AssetInterface $asset to save
     * @param string $namespace string that defines the group of assets
     * @param name $name overwite the name of the asset
     */
    public function writeAsset(AssetInterface $asset, $namespace, $name=null);
}
