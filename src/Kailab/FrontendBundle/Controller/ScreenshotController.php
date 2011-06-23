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

    public function bigAction($id)
    {
        $shot = $this->getScreenshot($id);
        $helper = $this->get('templating.helper.screenshot');
        $asset = $helper->combineScreenshotAsset($shot,'big');
        return $asset->getResponse();
    }

    public function itemAction($id)
    {
        $shot = $this->getScreenshot($id);
        $helper = $this->get('templating.helper.screenshot');
        $asset = $helper->combineScreenshotAsset($shot,'item');
        return $asset->getResponse();
    }

    public function smallAction($id)
    {
        $shot = $this->getScreenshot($id);
        $helper = $this->get('templating.helper.screenshot');
        $asset = $helper->combineScreenshotAsset($shot,'small');
        return $asset->getResponse();
    }

    public function fullAction($id)
    {
        $shot = $this->getScreenshot($id);
        $asset = $shot->getImage();
        return $asset->getResponse();
    }


}
