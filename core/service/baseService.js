export const DELETE_OPTION = {
  SOFT: "soft",
  HARD: "hard",
};

export default class BaseService {
  repository;
  constructor(repository) {
    this.repository = repository;
  }

  async create(data) {
    return this.repository.create({ data });
  }

  async createMany(data) {
    return this.repository.create({ data, skipDuplicates: true });
  }

  async read(filter) {
    return this.repository.findMany(filter);
  }

  async readOne(filter) {
    return this.repository.findFirst(filter);
  }

  async readById(id) {
    return this.repository.findUnique({
      where: { id },
    });
  }

  async update(filter, data) {
    return this.repository.update({
      where: filter,
      data,
    });
  }

  async updateMany(filter) {
    return this.repository.update({
      where: filter,
      data,
    });
  }

  async delete(filter, option = DELETE_OPTION.HARD) {
    if (option === DELETE_OPTION.SOFT)
      return this.repository.update({
        where: filter,
        data: { isActive: false },
      });

    return this.repository.delete({ where: filter });
  }

  async deleteMany(filter, option = DELETE_OPTION.HARD) {
    if (option === DELETE_OPTION.SOFT)
      return this.repository.updateMany({
        where: filter,
        data: { isActive: false },
      });

    return this.repository.deleteMany({ where: filter });
  }
}
