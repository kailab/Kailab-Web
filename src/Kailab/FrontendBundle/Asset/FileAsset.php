<?php

namespace Kailab\FrontendBundle\Asset;

use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\Response;

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
        $response = new Response();
        $response->headers->set('Content-Type',$this->getContentType());

        if(function_exists('apache_get_modules') && in_array('mod_xsendfile', apache_get_modules())) { 
            // use x-sendfile
            $response->headers->set('X-Sendfile',$this->getPath());
        }else{
            $response->headers->set('Content-Length',filesize($this->getPath()));
            $response->setContent($this->getContent());
        }
        return $response;
    }

}

