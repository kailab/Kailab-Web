<?php

namespace Kailab\FrontendBundle\Asset;
use Symfony\Component\HttpFoundation\Response;

abstract class AbstractAsset implements AssetInterface
{
    public function getResponse()
    {
        $response = new Response();
        $response->setContent($this->getContent());
        $response->headers->set('Content-Type',$this->getContentType());
        return $response;
    }
}

