/*
 * @license
 * Copyright (c) 2018. The Wevied Company.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {IsIn, IsMongoId, IsNumberString, IsOptional} from 'class-validator';

/**
 * APIPaging prefers using (_id > lastId) for skiping as .skip() is slower over large sets
 */
export class APIPaging {
    static LIMIT_DEFAULT: number = 20;
    static SORT_DEFAULT: number = -1;

    @IsOptional()
    @IsMongoId()
    lastId?: number;

    /**
     * @default 20
     */
    @IsOptional()
    @IsNumberString()
    limit?: string;

    /**
     * @default asc
     */
    @IsOptional()
    @IsIn(['asc','desc'])
    sort?: 'asc' | 'desc';

    /**
     * Returns conditions with support for paging
     * @param conditions
     * @param lastId
     * @return {{} & any & {_id: {$gt: *}}}
     */
    static withPagingCondition(conditions, lastId) {
        return lastId ? Object.assign({}, conditions, {_id: {'$gt': lastId}}) : conditions;
    }


    /**
     * Returns all constraints for paging
     *
     * @param conditions
     * @param {APIPaging} paging
     * @return {{conditions: {} & any & {_id: {$gt: *}}; limit: number; sort: number}}
     */
    static getPagingConstraints(conditions, paging:  APIPaging) {
        conditions = APIPaging.withPagingCondition(conditions, paging.lastId);

        const limit = paging.limit ? parseInt(paging.limit, 10): APIPaging.LIMIT_DEFAULT,
            sort = paging.sort && paging.sort === 'asc' ? 1 : APIPaging.SORT_DEFAULT;

        return {conditions, limit, sort};

    }

}
