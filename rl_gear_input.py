import click
import requests

from gear_json import GearJson


class RlGearInput:
    @staticmethod
    def get_gear():
        gear_request = requests.get("http://localhost:8080/equip")
        gear = []
        for item in gear_request.json():
            item_id = item["id"]
            if item_id != -1:
                gear.append(item_id)

        return gear

    @staticmethod
    def save_gear(name: str):
        GearJson.update_gear(name, RlGearInput.get_gear())


@click.command()
@click.option('--get', '-g', help='Get list of gear id', is_flag=True)
@click.option('--save', '-s', help='Save list of gear id', is_flag=True)
@click.option('--name', '-n', help='Name of gear list')
def main(get, save, name):
    if get:
        RlGearInput.get_gear()
    elif save:
        RlGearInput.save_gear(name)


if __name__ == '__main__':
    main()
