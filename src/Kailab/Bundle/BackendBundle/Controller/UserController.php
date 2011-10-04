<?php

namespace Kailab\Bundle\BackendBundle\Controller;

use Kailab\Bundle\SharedBundle\Controller\EntityCrudController;
use Kailab\Bundle\BackendBundle\Form\UserType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class UserController extends EntityCrudController
{
    protected function getEntityName()
    {
    	return 'KailabEntityBundle:User';
    }
    
    protected function getViewPrefix()
    {
    	return 'KailabBackendBundle:User';
    }
    
    protected function getRoutePrefix()
    {
    	return 'backend_user_';
    }

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
    
    /**
    * @Route("/user", name="backend_user_index")
    * @Template()
    */
    public function indexAction()
    {
    	return parent::indexAction();
    }
    
    /**
     * @Route("/user/new", name="backend_user_new")
     * @Template()
     */
    public function newAction()
    {
    	return parent::newAction();
    }
    
    /**
     * @Route("/user/{id}", name="backend_user_edit")
     * @Template()
     */
    public function editAction($id)
    {
    	return parent::editAction($id);
    }
    
    /**
    * @Route("/user/delete/{id}", name="backend_user_delete")
    * @Template()
    */
    public function deleteAction($id)
    {
    	return parent::deleteAction($id);
    }
    
    /**
    * @Route("/user/toggle/{id}", name="backend_user_toggle")
     * @Template()
    */
    public function toggleAction($id)
    {
    	return parent::toggleAction($id);
    }    

}
