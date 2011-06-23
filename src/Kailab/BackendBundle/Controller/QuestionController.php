<?php

namespace Kailab\BackendBundle\Controller;

use Kailab\BackendBundle\Controller\EntityCrudController;
use Kailab\BackendBundle\Form\QuestionType;
use Symfony\Component\HttpFoundation\Response;

class QuestionController extends EntityCrudController
{
    protected $entity_name = 'KailabFrontendBundle:Question';
    protected $view_prefix = 'KailabBackendBundle:Question';
    protected $route_prefix = 'backend_question_';

    protected function getFormType()
    {
        return new QuestionType();
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
        $session->setFlash('notice','Question was moved up.');
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
        $session->setFlash('notice','Question was moved down.');
        return $this->redirectCrud('list');
    }

}
