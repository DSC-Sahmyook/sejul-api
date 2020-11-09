import { Document } from "mongoose";

/**
 * Author       : 유경수
 * Create Date  : 2020-10-14
 * Description  : 디비 전체 공통 사항
 *
 * Updated
 * 2020-11-09 유경수    : 생성 일자 추가
 */
export interface ICollection extends Document {
    isDeleted: Boolean; // 삭제 여부 bit
    lastUpdatedDate: Date; // 마지막 수정 일자
    createdAt: Date;
}
