<?php

namespace Kailab\FrontendBundle\Repository;

use Doctrine\ORM\EntityRepository as BaseEntityRepository;

class EntityRepository extends BaseEntityRepository
{
    protected $entity_name = '';
    protected $dql_suffix = '';

    public function createEntityQuery($rest='',$select='e')
    {
        return $this->getEntityManager()
            ->createQuery('SELECT '.$select.' FROM '.$this->entity_name.' e '.$rest.$this->dql_suffix);
    }

    public function createCountEntityQuery($rest='')
    {
        return $this->createEntityQuery($rest,'COUNT(e.id)');
    }

    public function findAllInPage($page, $limit = 10)
    {
        $offset = ($page >= 1 ? $page-1 : $page)*$limit;
        $offset = $offset < 0 ? 0 : $offset;
        return $this->createEntityQuery()
            ->setFirstResult($offset)->setMaxResults($limit)->getResult();
    }

    public function findAllActiveInPage($page, $limit = 10)
    {
        $offset = ($page >= 1 ? $page-1 : $page)*$limit;
        $offset = $offset < 0 ? 0 : $offset;
        return $this->createEntityQuery('WHERE e.active = true')
            ->setFirstResult($offset)->setMaxResults($limit)->getResult();
    }

    public function getPagination($limit = 10)
    {
        $query = $this->createCountEntityQuery();
        return $this->getQueryPagination($query, $limit);
    }

    public function getActivePagination($limit = 10)
    {
        $query = $this->createCountEntityQuery('WHERE e.active = true');
        return $this->getQueryPagination($query, $limit);
    }

    protected function getQueryPagination($query, $limit = 10)
    {
        $count = $query->getSingleScalarResult();
        $last = ceil($count/$limit);
        return array(
            'count'     => $count,
            'limit'     => $limit,
            'last'      => $last,
            'pages'     => range(1,$last,1),
        );
    }

    public function findActive($id)
    {
        return $this->createEntityQuery('WHERE e.active = true AND e.id = :id')
            ->setParameter('id', intval($id))->getSingleResult();
    }

}
