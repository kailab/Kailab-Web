<?php

namespace Kailab\FrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\Response;
use Kailab\FrontendBundle\Asset\AssetInterface;
use Imagine\ImageInterface;
use Imagine\Gd\Imagine;
use Imagine\Image\Box;

class AssetController extends Controller
{
    protected function getImageResponse(ImageInterface $img)
    {
        $response = new Response();
        $response->setContent($img->get('png'));
        $response->headers->set('Content-Type','image/png');
        return $response;
    }

    public function getAssetImage(AssetInterface $asset)
    {
        $imagine = new Imagine();
        return $imagine->load($asset->getContent());
    }

    public function getAssetResponse(AssetInterface $asset)
    {
        return $asset->getResponse();
    }

}
