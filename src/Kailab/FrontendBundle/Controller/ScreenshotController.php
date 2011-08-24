<?php

namespace Kailab\FrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\Response;
use Kailab\FrontendBundle\Asset\AssetInterface;
use Kailab\FrontendBundle\Entity\Screenshot;
use Imagine\ImageInterface;
use Imagine\Gd\Imagine;
use Imagine\Image\Box;

class ScreenshotController extends Controller
{
    protected function getScreenshot($id)
    {
        $em = $this->get('doctrine')->getEntityManager();
        $repo = $em->getRepository('KailabFrontendBundle:Screenshot');

        $shot = $repo->find($id);
        if(!$shot){
            throw new NotFoundHttpException('The screenshot does not exist.');
        }
        return $shot;
    }

    protected function getScreenshotCombinedImageResponse($id, $name)
    {
        $shot = $this->getScreenshot($id);
        try{
            $asset = $shot->getImage($name);
            return $asset->getResponse();
        }catch(\Exception $e){
            $helper = $this->get('templating.helper.screenshot');
            $asset = $helper->combineScreenshotAsset($shot, $name);
            $shot->setImage($asset, $name);
            $em = $this->get('doctrine')->getEntityManager();
            $em->persist($shot);
            $em->flush();
            $asset = $shot->getImage($name);
            return $asset->getResponse();
        }
    }

    public function bigAction($id)
    {
        return $this->getScreenshotCombinedImageResponse($id,'big');
    }

    public function itemAction($id)
    {
        return $this->getScreenshotCombinedImageResponse($id,'item');
    }

    public function smallAction($id)
    {
        return $this->getScreenshotCombinedImageResponse($id,'small');
    }

    public function fullAction($id)
    {
        $shot = $this->getScreenshot($id);
        $asset = $shot->getImage();
        try{
            return $asset->getResponse();
        }catch(\Exception $e){
            throw new NotFoundHttpException('The screenshot does not exist.');
        }
    }


}
