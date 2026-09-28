import { COLORS } from '../constants/theme';
import { RankType } from '../types/student';

/**
 * Tính xếp loại học lực dựa theo thang điểm GPA:
 * - GPA >= 8.5: Giỏi
 * - GPA >= 7.0: Khá
 * - GPA >= 5.0: Trung bình
 * - GPA < 5.0: Yếu
 */
export const calculateRank = (gpa: number): RankType => {
  if (gpa >= 8.5) {
    return 'Giỏi';
  }
  if (gpa >= 7.0) {
    return 'Khá';
  }
  if (gpa >= 5.0) {
    return 'Trung bình';
  }
  return 'Yếu';
};

/**
 * Trả về cấu hình màu sắc tương ứng với xếp loại
 */
export const getRankBadgeStyle = (rank: RankType) => {
  switch (rank) {
    case 'Giỏi':
      return COLORS.rankGioi;
    case 'Khá':
      return COLORS.rankKha;
    case 'Trung bình':
      return COLORS.rankTrungBinh;
    case 'Yếu':
      return COLORS.rankYeu;
    default:
      return COLORS.rankTrungBinh;
  }
};
