<?php

namespace Kailab\FrontendBundle\Asset;

use Symfony\Component\HttpFoundation\File\File;

class FileAsset implements AssetInterface
{
    protected $name;
    protected $path;

    public function __construct($path,$name=null)
    {
        if(!$name){
            $name = basename($path);
        }
        $this->name = $name;
        $this->path = $path;
    }

    public function getName()
    {
        return $this->name;
    }

    public function getContent()
    {
        return file_get_contents($this->path);
    }

    public function getContentType()
    {
        $file = new File($this->path);
        return $file->getMimeType();
    }

}

