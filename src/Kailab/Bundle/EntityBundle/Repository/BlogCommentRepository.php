<?php

namespace Kailab\Bundle\EntityBundle\Repository;

use Kailab\Bundle\SharedBundle\Repository\EntityRepository;

class BlogCommentRepository extends EntityRepository
{
    public function findAllActiveOrdered()
    {
        return $this->createEntityQuery('WHERE e.active = true ORDER BY e.created DESC')
            ->getResult();
    }

    public function findAllActiveOrderedForPost($post)
    {
        return $this->createEntityQuery('WHERE e.active = true AND e.post = :post ORDER BY e.created DESC')
            ->setParameter('post', $post)->getResult();
    }
 

}
