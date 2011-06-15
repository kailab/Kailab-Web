<?php

namespace Kailab\FrontendBundle\Repository;

class BlogCategoryRepository extends EntityRepository
{
    protected $entity_name = 'KailabFrontendBundle:BlogCategory';

    public function findAllActiveOrdered()
    {
        return $this->createEntityQuery('WHERE e.active = true ORDER BY e.position ASC')
            ->getResult();
    }

    public function findActive($id)
    {
        return $this->createEntityQuery('WHERE e.active = true AND e.id = :id')
            ->setParameter('id', intval($id))->getSingleResult();
    }

}
