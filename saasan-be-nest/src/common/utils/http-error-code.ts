export const HttpErrorCodeMessage = {
  poll404: 'Poll not found',
  pollOption404: 'Poll option not found',
  vote505: 'Vote record failed',
  user404: 'User does not exist',
  report404: 'Report does not exist',
  politician404: 'Politician does not exist',
  ward404: 'Ward does not exist',
  province404: 'Province does not exist',
  district404: 'District does not exist',
  municipality404: 'Municipality does not exist',
  constituency404: 'Constituency does not exist',
  invalidCredentials: 'Invalid credentials',
  userAlreadyExistsWithEmail: 'User already exists with this phone number',
  provinceAlreadyExistsWithNameOrProvinceNumber:
    'Province already exists with this name or province number',
  districtAlreadyExistsWithName: 'District already exists with this name',
  constituencyAlreadyExistsWithDistrictAndConstituencyNumber:
    'Constituency already exists with this district and constituency number',
  municipalityAlreadyExistsWithNameOrWithDistrict:
    'Constituency already exists with this name or with this district',
  wardAlreadyExistsWithWardNumberAndWithMunicipality:
    'Ward already exists with this ward number and with this municipality',
} as const;
export type HttpErrorCodeTypes = keyof typeof HttpErrorCodeMessage;
