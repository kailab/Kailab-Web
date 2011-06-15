<?php

namespace Kailab\BackendBundle\Controller;

use Kailab\BackendBundle\Controller\EntityCrudController;
use Kailab\FrontendBundle\Entity\Slide;
use Kailab\BackendBundle\Form\AppType;

class TecController extends EntityCrudController
{
    protected $entity_name = 'KailabFrontendBundle:Tec';
    protected $view_prefix = 'KailabBackendBundle:Tec';
    protected $route_prefix = 'backend_tec_';

    protected function getFormType()
    {
        return new AppType();
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
        $session->setFlash('notice','Tecnology was moved up.');
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
        $session->setFlash('notice','Tecnology was moved down.');
        return $this->redirectCrud('list');
    }

}
