<?php

namespace Kailab\FrontendBundle\Asset;

use Symfony\Component\HttpFoundation\File\File;
use Kailab\FrontendBundle\HttpFoundation\FileResponse;

class FileAsset extends AbstractAsset
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

    public function getPath()
    {
        return $this->path;
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

    public function getResponse()
    {
        $response = new FileResponse($this->getPath());
        $response->headers->set('Content-Type',$this->getContentType());
        return $response;
    }

}

