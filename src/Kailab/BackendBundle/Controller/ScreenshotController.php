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
    protected $limit = 8;

    protected function getFormType()
    {
        return new ScreenshotType();
    }

    protected function saveEntity($entity)
    {
        $helper = $this->get('templating.helper.screenshot');
        $helper->combineImages($entity);
        return parent::saveEntity($entity);
    }
}
