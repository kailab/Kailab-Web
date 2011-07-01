<?php

namespace Kailab\BackendBundle\Controller;

use Kailab\BackendBundle\Controller\EntityCrudController;
use Kailab\FrontendBundle\Entity\Slide;
use Kailab\BackendBundle\Form\TechType;

class TechController extends EntityCrudController
{
    protected $entity_name = 'KailabFrontendBundle:Tech';
    protected $view_prefix = 'KailabBackendBundle:Tech';
    protected $route_prefix = 'backend_tech_';

    protected function getFormType()
    {
        return new TechType();
    }

    protected function saveEntity($entity)
    {
        $em = $this->getEntityManager();
        $em->persist($entity);
        // remove old screenshots
        foreach($entity->getTechScreenshots() as $shot){
            if(!$shot->getTech()){
                $em->remove($shot);
            }
        }
        $em->flush();
    }

    public function imageAction($id)
    {
        $entity = $this->findEntity($id);
        $img = $entity->getImage();
        return $img->getResponse();
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
