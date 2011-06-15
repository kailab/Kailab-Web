<?php

namespace Kailab\FrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\Response;
use Kailab\FrontendBundle\Asset\AssetInterface;
use Imagine\ImageInterface;
use Imagine\Gd\Imagine;
use Imagine\Image\Box;

class ScreenshotController extends Controller
{
    protected function getAsset($id)
    {
        $em = $this->get('doctrine')->getEntityManager();
        $repo = $em->getRepository('KailabFrontendBundle:Screenshot');

        $shot = $repo->find($id);
        if(!$shot){
            throw new NotFoundHttpException('The screenshot does not exist.');
        }
        $asset = $shot->getImage()->getAsset();
        if(!$asset instanceof AssetInterface){
            throw new NotFoundHttpException('The screenshot does not have a valid asset.');
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

    public function bigAction($id)
    {
        $asset = $this->getAsset($id);

        // resize image
        $imagine = new Imagine();
        $image = $imagine->load($asset->getContent());
        $box = new Box(200, 300);
        $thumb = $image->thumbnail($box,ImageInterface::THUMBNAIL_OUTBOUND);

        return $this->getImageResponse($thumb);
    }

    public function smallAction($id)
    {
        $asset = $this->getAsset($id);

        // resize image
        $imagine = new Imagine();
        $image = $imagine->load($asset->getContent());
        $box = new Box(65, 100);
        $thumb = $image->thumbnail($box,ImageInterface::THUMBNAIL_OUTBOUND);

        return $this->getImageResponse($thumb);

    }
}
