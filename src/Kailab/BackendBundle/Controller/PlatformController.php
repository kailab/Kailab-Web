<?php

namespace Kailab\BackendBundle\Controller;

use Kailab\BackendBundle\Controller\EntityCrudController;
use Kailab\FrontendBundle\Entity\Screenshot;
use Kailab\BackendBundle\Form\PlatformType;
use Symfony\Component\HttpFoundation\Response;
use Kailab\FrontendBundle\Asset\AssetInterface;
use Kailab\FrontendBundle\Asset\ParameterAsset;
use Imagine\ImageInterface;
use Imagine\Gd\Imagine;
use Imagine\Image\Box;




class PlatformController extends EntityCrudController
{
    protected $entity_name = 'KailabFrontendBundle:Platform';
    protected $view_prefix = 'KailabBackendBundle:Platform';
    protected $route_prefix = 'backend_platform_';

    protected function getFormType()
    {
        return new PlatformType();
    }

    protected function saveEntity($entity)
    {
        $helper = $this->get('templating.helper.screenshot');

        // update blue background
        $shot = new Screenshot();
        $shot->setPlatform($entity);
        $asset = $helper->combineImage($shot,null);
        $entity->setBackground($asset, 'blue');

        // resize icon
        $asset = $entity->getIcon()->getAsset();
        $imagine = new Imagine();
        $image = $imagine->load($asset->getContent());
        $image = $image->resize(new Box(30,30), ImageInterface::THUMBNAIL_OUTBOUND);

        $entity->setIcon(new ParameterAsset(array(
            'content'       => $image->get('png'),
            'content_type'  => 'image/png'
        )));

        return parent::saveEntity($entity);
    }
}
