<?php

namespace Kailab\FrontendBundle\Asset;

use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\Response;
use Kailab\FrontendBundle\HttpFoundation\FileResponse;

class FileAsset extends AbstractAsset implements PublicAssetInterface
{
    protected $name = null;
    protected $path = null;
    protected $uri = null;
    protected $content = null;

    public function __construct($path,$name=null)
    {
        if(!$name){
            $name = basename($path);
        }
        $this->name = $name;
        $this->path = $path;
    }

    public function setUri($uri)
    {
        $this->uri = $uri;
    }

    public function serialize() {
        $data = array(
            'name'      => $this->getName(),
            'path'      => $this->getPath(),
            'uri'       => $this->getUri(),
            'content'   => $this->getContent(),
        );
        return serialize($data);
    }

    public function unserialize($data) {
        if(!is_array($data)){
            return;
        }
        if(isset($data['name'])){
            $this->name = $data['name'];
        }
        if(isset($data['uri'])){
            $this->uri = $data['uri'];
        }
        if(isset($data['path'])){
            $this->path = $data['path'];
        }
        if(isset($data['content'])){
            $this->content = $data['content'];
        }
    }

    public function getUri()
    {
        return $this->uri;
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
        if($this->content == null && $this->path && is_readable($this->path)){
            $this->content = file_get_contents($this->path);
        }
        return $this->content;
    }

    public function getContentType()
    {
        $file = new File($this->path);
        return $file->getMimeType();
    }

    public function getResponse()
    {
        if($this->getUri()){
            $response = new Response();
            $response->headers->set('Location', $this->getUri());
        }else{
            $response = new FileResponse($this->getPath());
            $response->headers->set('Content-Type',$this->getContentType());
        }
        return $response;
    }

}

