<?php

namespace Kailab\FrontendBundle\Asset;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Finder\Finder;

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

    protected function getUri($ns, $name='')
    {
        $path = 'upload/'.str_replace(' ','_',$ns).'/'.$name;
        $helper = $this->container->get('templating.helper.assets');
        return $helper->getUrl($path);
    }

    public function hasAsset($name, $namespace)
    {
        if($name instanceof AssetInterface){
            $name = $this->getAssetFileName($name);
        }
        return is_file($path);
    }

    public function getAssetFileName(AssetInterface $asset)
    {
        $file = new FakeFile($asset->getContentType());
        $ext = $file->guessExtension();
        $name = $asset->getName();
        $name .= $ext ? '.'.$ext : $name;
        return $name;
    }

    public function writeAsset(AssetInterface $asset, $namespace)
    {
        $dir = $this->getDirectory($namespace);
        $path = $dir.'/'.$this->getAssetFileName($asset);

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
            $name = $this->getAssetFileName($name);
        }

        $dir = $this->getDirectory($namespace);
        $path = $dir.'/'.$name;

        if (!is_file($path) || !is_readable($path)) {
            throw new \RuntimeException('Unable to delete file '.$path);
        }

        return @unlink($path);
    }

    protected function findFileInDirectory($dir, $pattern)
    {
        $finder = new Finder();
        $finder->files()->in($dir)->name($pattern);
        foreach($finder as $file){
            return $file;
        }
    }

    public function readAsset($name, $namespace)
    {
        $dir = $this->getDirectory($namespace);

        $file = $this->findFileInDirectory($dir,$name.'.*');
        if ($file === null) {
            $file = $this->findFileInDirectory($dir,$name);
        }
        if ($file === null) {
            throw new \RuntimeException('Unable to read file for asset '.$name);
        }

        $asset = new FileAsset($file->getRealPath());
        $uri = $this->getUri($namespace, $file->getFileName());
        $asset->setUri($uri);
        return $asset;
    }
}
