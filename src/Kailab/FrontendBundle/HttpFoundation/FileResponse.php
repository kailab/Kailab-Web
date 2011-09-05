<?php

namespace Kailab\FrontendBundle\HttpFoundation;
use Symfony\Component\HttpFoundation\Response;

class FileResponse extends Response
{
    protected $path = null;

    public function __construct($path)
    {
        parent::__construct();
        $this->setPath($path);
    }   

    public function setPath($path)
    {
        $this->path = $path;

        if($this->path && is_readable($this->path)){
            $this->headers->set('Content-Length',filesize($this->path));
        }

        if($this->hasXSendFile()) { 
            // use x-sendfile
            $this->headers->set('X-Sendfile',$this->path);
        }
    }

    protected function hasXSendFile()
    {
        return false;
        return function_exists('apache_get_modules') && in_array('mod_xsendfile', apache_get_modules());
    }

    public function sendContent()
    {
        if(!$this->hasXSendFile() && $this->path && is_readable($this->path)){
            readfile($this->path);
        }else{
            return parent::sendContent();
        }
    }
}
 
