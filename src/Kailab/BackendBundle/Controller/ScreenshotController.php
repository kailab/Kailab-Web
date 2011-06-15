<?php

namespace Kailab\BackendBundle\Controller;

use Kailab\BackendBundle\Controller\EntityCrudController;
use Kailab\FrontendBundle\Entity\Screenshot;
use Kailab\BackendBundle\Form\ScreenshotType;

class ScreenshotController extends EntityCrudController
{
    protected $entity_name = 'KailabFrontendBundle:Screenshot';
    protected $view_prefix = 'KailabBackendBundle:Screenshot';
    protected $route_prefix = 'backend_screenshot_';

    protected function getFormType()
    {
        return new ScreenshotType();
    }

    public function imageAction($id)
    {
        $entity = $this->findEntity($id);
        $img = $entity->getImage();
        return $img->getResponse();
    }
}
