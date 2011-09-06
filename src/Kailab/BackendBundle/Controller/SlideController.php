<?php

namespace Kailab\BackendBundle\Controller;

use Kailab\BackendBundle\Controller\EntityCrudController;
use Kailab\FrontendBundle\Entity\Slide;
use Kailab\BackendBundle\Form\SlideType;
use Kailab\FrontendBundle\Asset\AssetInterface;
use Kailab\FrontendBundle\Asset\ParameterAsset;
use Imagine\ImageInterface;
use Imagine\Gd\Imagine;
use Imagine\Image\Box;

class SlideController extends EntityCrudController
{
    protected $entity_name = 'KailabFrontendBundle:Slide';
    protected $view_prefix = 'KailabBackendBundle:Slide';
    protected $route_prefix = 'backend_slide_';

    protected function getFormType()
    {
        return new SlideType();
    }

    public function upAction($id)
    {
        $entity = $this->findEntity($id);
        $position = $entity->getPosition();
        $entity->setPosition($position-1);
        $em = $this->getEntityManager();
        $em->persist($entity);
        $em->flush();
        $session = $this->get('session');
        $session->setFlash('notice','Slide was moved up.');
        return $this->redirectCrud('list');
    }

    public function downAction($id)
    {
        $entity = $this->findEntity($id);
        $position = $entity->getPosition();
        $entity->setPosition($position+1);
        $em = $this->getEntityManager();
        $em->persist($entity);
        $em->flush();
        $session = $this->get('session');
        $session->setFlash('notice','Slide was moved down.');
        return $this->redirectCrud('list');
    }

    protected function saveEntity($entity)
    {
        $asset = $entity->getImage()->getAsset();
        if($asset instanceof AssetInterface){
            // resize image
            $imagine = new Imagine();
            $image = $imagine->load($asset->getContent());
            $box = new Box(470, 440);
            $thumb = $image->thumbnail($box,ImageInterface::THUMBNAIL_OUTBOUND);
            $asset = new ParameterAsset(array(
                'content'       => $thumb->get('png'),
                'content_type'  => 'image/png'
            ));
            $entity->setImage($asset);
        }
        return parent::saveEntity($entity);
    }



}
