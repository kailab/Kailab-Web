<?php

namespace Kailab\FrontendBundle\Asset;

class ParameterAsset extends AbstractAsset
{
    protected $name = null;
    protected $content = null;
    protected $content_type = null;

    public function __construct(array $params)
    {
        if(isset($params['name'])){
            $this->name = $params['name'];
        }
        if(isset($params['content'])){
            $this->content = $params['content'];
        }
        if(isset($params['content_type'])){
            $this->content_type = $params['content_type'];
        }
    }

    public function getName()
    {
        return $this->name;
    }

    public function getContent()
    {
        return $this->content;
    }

    public function getContentType()
    {
        return $this->content_type;
    }

}

