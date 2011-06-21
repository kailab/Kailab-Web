<?php

namespace Kailab\FrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\Response;
use Kailab\FrontendBundle\Asset\AssetInterface;
use Imagine\ImageInterface;
use Imagine\Gd\Imagine;
use Imagine\Image\Box;

class PlatformController extends Controller
{
    protected function getAsset($id, $type)
    {
        $em = $this->get('doctrine')->getEntityManager();
        $repo = $em->getRepository('KailabFrontendBundle:Platform');

        $platform = $repo->find($id);
        if(!$platform){
            throw new NotFoundHttpException('The platform does not exist.');
        }
        $method = 'get'.$this->container->camelize($type);
        if(!method_exists($platform,$method)){
            throw new NotFoundHttpException('The platform does not have a valid asset.');
        }
        $asset = $platform->$method()->getAsset();
        if(!$asset instanceof AssetInterface){
            throw new NotFoundHttpException('The platform does not have a valid asset.');
        }
        return $asset;
    }

    protected function getImageResponse(ImageInterface $img)
    {
        $response = new Response();
        $response->setContent($img->get('png'));
        $response->headers->set('Content-Type','image/png');
        return $response;
    }

    public function iconAction($id)
    {
        $asset = $this->getAsset($id,'icon');

        // resize image
        $imagine = new Imagine();
        $image = $imagine->load($asset->getContent());
        $box = new Box(45, 45);
        $thumb = $image->thumbnail($box,ImageInterface::THUMBNAIL_OUTBOUND);

        return $this->getImageResponse($thumb);
    }

    public function backgroundAction($id)
    {
        $asset = $this->getAsset($id,'background');

        // resize image
        $imagine = new Imagine();
        $image = $imagine->load($asset->getContent());
        $box = new Box(250, 475);
        $thumb = $image->thumbnail($box,ImageInterface::THUMBNAIL_OUTBOUND);

        return $this->getImageResponse($thumb);

    }

    public function smallBackgroundAction($id)
    {
        $asset = $this->getAsset($id,'background');

        // resize image
        $imagine = new Imagine();
        $image = $imagine->load($asset->getContent());
        $box = new Box(250, 475);
        $thumb = $image->thumbnail($box,ImageInterface::THUMBNAIL_OUTBOUND);

        return $this->getImageResponse($thumb);

    }

}
