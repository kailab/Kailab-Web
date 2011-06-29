<?php

namespace Kailab\FrontendBundle\Repository;

class TechRepository extends EntityRepository
{
    protected $entity_name = 'KailabFrontendBundle:Tech';

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

    public function findForHomepage()
    {
        return $this->createEntityQuery('WHERE e.active = true ORDER BY e.position DESC')
            ->setMaxResults(1)->getSingleResult();
    }

    public function findActiveBySlug($slug)
    {
        try{
            return $this->createEntityQuery('WHERE e.active = true AND e.slug = :slug')
                ->setParameter('slug',$slug)->setMaxResults(1)->getSingleResult();
        }catch(\Exception $e){
            return null;
        }
    }
}
