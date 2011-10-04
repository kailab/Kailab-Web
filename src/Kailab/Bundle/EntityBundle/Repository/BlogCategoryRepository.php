<?php

namespace Kailab\Bundle\EntityBundle\Repository;

use Kailab\Bundle\SharedBundle\Repository\EntityRepository;

class BlogCategoryRepository extends EntityRepository
{
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
