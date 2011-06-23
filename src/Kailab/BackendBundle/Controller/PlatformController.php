<?php

namespace Kailab\BackendBundle\Controller;

use Kailab\BackendBundle\Controller\EntityCrudController;
use Kailab\FrontendBundle\Entity\Screenshot;
use Kailab\BackendBundle\Form\PlatformType;
use Symfony\Component\HttpFoundation\Response;
use Kailab\FrontendBundle\Asset\AssetInterface;

class PlatformController extends EntityCrudController
{
    protected $entity_name = 'KailabFrontendBundle:Platform';
    protected $view_prefix = 'KailabBackendBundle:Platform';
    protected $route_prefix = 'backend_platform_';

    protected function getFormType()
    {
        return new PlatformType();
    }

    public function iconAction($id)
    {
        $repo = $this->getRepository();
        $platform = $repo->find($id);
        if(!$platform){
            throw new NotFoundHttpException('The platform does not exist.');
        }
        $icon = $platform->getIcon();
        return $icon->getResponse();
    }

    public function backgroundAction($id)
    {
        $repo = $this->getRepository();
        $platform = $repo->find($id);
        if(!$platform){
            throw new NotFoundHttpException('The platform does not exist.');
        }
        $icon = $platform->getBackground();

        $shot = new Screenshot();
        $shot->setPlatform($platform);
        $helper = $this->get('templating.helper.screenshot');
        $asset = $helper->combineScreenshotAsset($shot,null);
        if(!$asset instanceof AssetInterface){
            throw new NotFoundHttpException('The platform does not exist.');
        }
        return $asset->getResponse();
    }

}
