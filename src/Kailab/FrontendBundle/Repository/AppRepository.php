<?php

namespace Kailab\FrontendBundle\Repository;

class AppRepository extends EntityRepository
{
    protected $entity_name = 'KailabFrontendBundle:App';

    public function findAllActiveOrdered()
    {
        return $this->createEntityQuery('WHERE e.active = true ORDER BY e.position DESC')
            ->getResult();
    }

    public function findForSitemap()
    {
        return $this->createEntityQuery('WHERE e.active = true ORDER BY e.position DESC')
            ->setMaxResults(5)->getResult();
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
