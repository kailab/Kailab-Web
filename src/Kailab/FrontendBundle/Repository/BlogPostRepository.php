<?php

namespace Kailab\FrontendBundle\Repository;

use Doctrine\ORM\EntityRepository;

class BlogPostRepository extends EntityRepository
{
    public function findActiveOrdered()
    {
        return $this->getEntityManager()
            ->createQuery('SELECT p FROM KailabFrontendBundle:BlogPost p WHERE p.active = true ORDER BY p.updated DESC')
            ->getResult();
    }

    public function findInPage($page, $limit = 10)
    {
        $offset = ($page >= 1 ? $page-1 : $page)*$limit;
        $offset = $offset < 0 ? 0 : $offset;
        return $this->getEntityManager()
            ->createQuery('SELECT p FROM KailabFrontendBundle:BlogPost p WHERE p.active = true ORDER BY p.updated DESC')
            ->setFirstResult($offset)->setMaxResults($limit)->getResult();
    }

    public function getPagination($limit = 10)
    {
        $query = $this->getEntityManager()
            ->createQuery('SELECT COUNT(p.id) FROM KailabFrontendBundle:BlogPost p WHERE p.active = true');
        $count = $query->getSingleScalarResult();
        $last = ceil($count/$limit);

        return array(
            'count'     => $count,
            'limit'     => $limit,
            'last'      => $last,
            'pages'     => range(1,$last,1),
        );
    }
}
