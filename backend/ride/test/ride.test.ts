import Position from "../src/domain/Position";
import Ride from "../src/domain/Ride";

test("Deve testar uma ride", function () {
    const ride = Ride.create("", 0, 0, 0, 0);
    ride.accept("");
    ride.start();
    const position1 = Position.create("", -23.539989, -46.592060);
    ride.updatePosition(position1);
    const position2 = Position.create("", -23.547858, -46.610637);
    ride.updatePosition(position2);
    ride.finish();
    expect(ride.getDistance()).toBe(2);
    expect(ride.getFare()).toBe(4.2);
    console.log(ride);
});