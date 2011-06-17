<?php

namespace Kailab\FrontendBundle\Repository;

class BlogCommentRepository extends EntityRepository
{
    protected $entity_name = 'KailabFrontendBundle:BlogComment';

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
