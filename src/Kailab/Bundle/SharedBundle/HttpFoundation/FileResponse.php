<?php

namespace Kailab\Bundle\SharedBundle\HttpFoundation;
use Symfony\Component\HttpFoundation\Response;

class FileResponse extends Response
{
    protected $path = null;
    protected $attachment = null;

    public function __construct($path, $name=null)
    {
        parent::__construct();
        $this->setAttachment($name);
        $this->setPath($path);
    }
    
    public function setAttachment($name)
    {
    	$this->attachment = $name;
    }

    public function setPath($path)
    {
        $this->path = $path;

        if($this->path && is_readable($this->path)){
            $this->headers->set('Content-Length', filesize($this->path));
        }

        if($this->hasXSendFile()) { 
            // use x-sendfile
            $this->headers->set('X-Sendfile',$this->path);
        }
        if($this->attachment){
        	$this->headers->set('Content-Disposition',
        		'attachment; filename="'.$this->attachment.'"');
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
 
