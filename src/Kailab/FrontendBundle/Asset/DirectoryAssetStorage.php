<?php

namespace Kailab\FrontendBundle\Asset;

use Symfony\Component\DependencyInjection\ContainerInterface;

class DirectoryAssetStorage implements AssetStorageInterface
{
    protected $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    protected function getDirectory($ns)
    {
        $dir = str_replace(' ','_',$ns);
        $kernel = $this->container->get('kernel');
        $dir = $kernel->getRootDir().'/upload/'.$dir;
        return $dir;
    }

    public function hasAsset($name, $namespace)
    {
        if($name instanceof AssetInterface){
            $name = $name->getName();
        }
        return is_file($path);
    }

    public function writeAsset(AssetInterface $asset, $namespace)
    {
        $dir = $this->getDirectory($namespace);
        $path = $dir.'/'.$asset->getName();

        $content = $asset->getContent();

        if (!is_dir($dir) && false === @mkdir($dir, 0777, true)) {
            throw new \RuntimeException('Unable to create directory '.$dir);
        }
        if (false === @file_put_contents($path, $content)) {
            throw new \RuntimeException('Unable to write file '.$path);
        }
    }

    public function deleteAsset($name, $namespace)
    {
        if($name instanceof AssetInterface){
            $name = $name->getName();
        }

        $dir = $this->getDirectory($namespace);
        $path = $dir.'/'.$name;

        if (!is_file($path) || !is_readable($path)) {
            throw new \RuntimeException('Unable to delete file '.$path);
        }

        return @unlink($path);
    }

    public function readAsset($name, $namespace)
    {
        $dir = $this->getDirectory($namespace);
        $path = $dir.'/'.$name;

        if (!is_file($path) || !is_readable($path)) {
            throw new \RuntimeException('Unable to read file '.$path);
        }
        return new FileAsset($path);
    }
}
