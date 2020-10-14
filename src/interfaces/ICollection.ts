/**
 * Author       : 유경수
 * Create Date  : 2020-10-14
 * Description  : 디비 전체 공통 사항
 */
export interface ICollection {
    _id: string; // MongoDB 자동 생성 id
    isDeleted: Boolean; // 삭제 여부 bit
    lastUpdatedDate: Date; // 마지막 수정 일자
}
