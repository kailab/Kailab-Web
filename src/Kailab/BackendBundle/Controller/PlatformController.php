<?php

namespace Kailab\BackendBundle\Controller;

use Kailab\BackendBundle\Controller\EntityCrudController;
use Kailab\FrontendBundle\Entity\Slide;
use Kailab\BackendBundle\Form\PlatformType;
use Symfony\Component\HttpFoundation\Response;

class PlatformController extends EntityCrudController
{
    protected $entity_name = 'KailabFrontendBundle:Platform';
    protected $view_prefix = 'KailabBackendBundle:Platform';
    protected $route_prefix = 'backend_platform_';

    protected function getFormType()
    {
        return new PlatformType();
    }

}
