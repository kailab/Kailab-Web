<?php

namespace Kailab\FrontendBundle\Repository;

class AppRepository extends EntityRepository
{
    protected $entity_name = 'KailabFrontendBundle:App';

    public function findAllActiveOrdered($type='app')
    {
        return $this->createEntityQuery('WHERE e.active = true AND e.type = :type ORDER BY e.position DESC')
            ->setParameter('type',$type)->getResult();
    }

    public function findForSitemap($type='app')
    {
        return $this->createEntityQuery('WHERE e.active = true AND e.type = :type ORDER BY e.position DESC')
            ->setParameter('type',$type)->setMaxResults(5)->getResult();
    }

    public function findForHomepage($type='app')
    {
        try{
            return $this->createEntityQuery('WHERE e.active = true AND e.type = :type ORDER BY e.position DESC')
                ->setParameter('type',$type)->setMaxResults(1)->getSingleResult();
        }catch(\Exception $e){
            return null;
        }
    }

}
