<?php

namespace Kailab\BackendBundle\Controller;

use Kailab\BackendBundle\Controller\EntityCrudController;
use Kailab\BackendBundle\Form\UserType;
use Symfony\Component\HttpFoundation\Response;

class UserController extends EntityCrudController
{
    protected $entity_name = 'KailabFrontendBundle:User';
    protected $view_prefix = 'KailabBackendBundle:User';
    protected $route_prefix = 'backend_user_';

    protected function getFormType()
    {
        return new UserType();
    }

    protected function createEntity()
    {
        $um = $this->get('fos_user.user_manager');
        return $um->createUser();
    }

    protected function saveEntity($user)
    {
        $user->setRoles(array('ROLE_SUPER_ADMIN'));
        $em = $this->getEntityManager();
        $em->persist($user);
        $em->flush();
    }

}
