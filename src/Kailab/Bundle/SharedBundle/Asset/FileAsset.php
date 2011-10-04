<?php

namespace Kailab\Bundle\SharedBundle\Asset;

use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Response;
use Kailab\Bundle\SharedBundle\HttpFoundation\FileResponse;

class FileAsset extends AbstractAsset implements PublicAssetInterface
{
    protected $name = null;
    protected $path = null;
    protected $uri = null;
    protected $content = null;
    protected $content_type = null;

    public function __construct($path,$name=null)
    {
    	if($path instanceof \SplFileInfo){
    		$this->path = $path->__toString();
    		if($path instanceof UploadedFile){
	    		$this->name = $path->getClientOriginalName();
	    		$this->content_type = $path->getClientMimeType();
    		}
    	}else if(is_string($path)){
    		$this->path = $path;
    		$this->name = basename($path);
    	}
        if($name){
        	$this->name = $name;
        }
    }
    
    public function getExtension()
    {
    	$name = $this->name ? $this->name : $this->path;
    	$name = explode(".", $name);
    	return end($name);
    }

    public function setUri($uri)
    {
        $this->uri = $uri;
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
    	if(!$this->content_type){
        	$file = new File($this->path);
        	$this->content_type = $file->getMimeType();
    	}
    	return $this->content_type;
    }

    public function getResponse($attachment=false)
    {
        if($this->getUri() && !$attachment){
            $response = new Response();
            $response->headers->set('Location', $this->getUri());
        }else{
            $response = new FileResponse($this->getPath());
            $response->headers->set('Content-Type', $this->getContentType());
        }
        return $response;
    }

}

