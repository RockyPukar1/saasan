export const HttpErrorCodeMessage = {
  /** Auth */
  invalidCredentials: 'Invalid credentials',

  /** User */
  user404: 'User does not exist',
  permission403: 'You do not have permission to perform this action',

  userAlreadyExistsWithEmail: 'User already exists with this phone number',

  /** Poll */
  poll404: 'Poll not found',
  pollOption404: 'Poll option not found',

  vote505: 'Vote record failed',

  userDeletionConflict:
    'Cannot delete user with associated reports or activities',

  /** Report */
  report404: 'Report does not exist',

  /** Event */
  event404: 'Event does not exist',

  /** Case */
  case404: 'Case does not exist',

  /** Politics */
  politician404: 'Politician does not exist',

  /** Location */
  ward404: 'Ward does not exist',
  province404: 'Province does not exist',
  district404: 'District does not exist',
  municipality404: 'Municipality does not exist',
  constituency404: 'Constituency does not exist',

  provinceAlreadyExistsWithNameOrProvinceNumber:
    'Province already exists with this name or province number',
  districtAlreadyExistsWithName: 'District already exists with this name',
  constituencyAlreadyExistsWithDistrictAndConstituencyNumber:
    'Constituency already exists with this district and constituency number',
  municipalityAlreadyExistsWithNameOrWithDistrict:
    'Constituency already exists with this name or with this district',
  wardAlreadyExistsWithWardNumberAndWithMunicipality:
    'Ward already exists with this ward number and with this municipality',

  /** Jurisdiction */
  jurisdiction403: 'User does not have access to this jurisdiction',

  /** Message */
  message404: 'Message does not exist',
  message403: 'User does not have access to this message',
} as const;
export type HttpErrorCodeTypes = keyof typeof HttpErrorCodeMessage;
