<?php

namespace Kailab\Bundle\SharedBundle\Asset;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Finder\Finder;

class DirectoryAssetStorage implements AssetStorageInterface
{
    protected $container;
	protected $files = array();

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
    
    public function getAssetExtension(AssetInterface $asset)
    {
    	$ext = null;
    	if($asset instanceof FileAsset){
    		$ext = $asset->getExtension();
    	}
    	if(!$ext){
	    	$file = new FakeFile($asset->getContentType());
	    	$ext = $file->guessExtension();
    	}
    	return $ext;
    }

    public function getAssetFileName(AssetInterface $asset, $name=null)
    {
    	$ext = $this->getAssetExtension($asset);
        $name = $name ? $name : $asset->getName();
        $name .= $ext ? '.'.$ext : '';
        return $name;
    }

    public function writeAsset(AssetInterface $asset, $namespace, $name=null)
    {
        $dir = $this->getDirectory($namespace);
        $path = $dir.'/'.$this->getAssetFileName($asset, $name);

        $content = $asset->getContent();
		if(mb_strlen($content)==0){
			return false;
		}
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

    protected function findFileInDirectory($dir, $prefix)
    {
		if(!isset($this->files[$dir])){
			$this->files[$dir] = array();
			$finder = new Finder();
			$finder->files()->in($dir);
			foreach($finder as $file){
				$this->files[$dir][$file->getFilename()] = $file->getRealPath();
			}
		}
		foreach($this->files[$dir] as $name=>$path){
			if(mb_substr($name,0, mb_strlen($prefix)) === $prefix){
				return $path;
			}
		}
		return null;
    }

    public function readAsset($name, $namespace)
    {
        $dir = $this->getDirectory($namespace);

        $path = $this->findFileInDirectory($dir,$name.'.');
        if ($path === null) {
            $path = $this->findFileInDirectory($dir,$name);
        }
        if ($path === null) {
            throw new \RuntimeException('Unable to read file for asset '.$name);
        }

        $asset = new FileAsset($path);
        $uri = $this->getUri($namespace, basename($path));
        $asset->setUri($uri);
        return $asset;
    }
}
