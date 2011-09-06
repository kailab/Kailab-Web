<?php

namespace Kailab\BackendBundle\Controller;

use Kailab\BackendBundle\Controller\EntityCrudController;
use Kailab\FrontendBundle\Entity\Slide;
use Kailab\BackendBundle\Form\TechType;
use Kailab\FrontendBundle\Asset\AssetInterface;
use Kailab\FrontendBundle\Asset\ParameterAsset;
use Imagine\ImageInterface;
use Imagine\Gd\Imagine;
use Imagine\Image\Box;



class TechController extends EntityCrudController
{
    protected $entity_name = 'KailabFrontendBundle:Tech';
    protected $view_prefix = 'KailabBackendBundle:Tech';
    protected $route_prefix = 'backend_tech_';

    protected function getFormType()
    {
        return new TechType();
    }

    protected function resizeAsset(AssetInterface $asset, $w, $h)
    {
        $imagine = new Imagine();
        $image = $imagine->load($asset->getContent());
        $image = $image->resize(new Box($w,$h), ImageInterface::THUMBNAIL_OUTBOUND);

        return new ParameterAsset(array(
            'content'       => $image->get('png'),
            'content_type'  => 'image/png'
        ));
    }

    protected function saveEntity($entity)
    {
        $em = $this->getEntityManager();

        // remove old screenshots
        if($id = $entity->getId()){
            $em->createQuery('delete from KailabFrontendBundle:TechScreenshot s where s.tech = :id')
                ->setParameter('id',$id)->execute();
        }

        // resize icon
        $asset = $entity->getIcon()->getAsset();
        $entity->setIcon($this->resizeAsset($asset,30,30));

        // resize image
        $asset = $entity->getImage()->getAsset();
        $entity->setImage($this->resizeAsset($asset,150,150));

        return parent::saveEntity($entity);
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
        $session->setFlash('notice','Technology was moved up.');
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
        $session->setFlash('notice','Technology was moved down.');
        return $this->redirectCrud('list');
    }

}
