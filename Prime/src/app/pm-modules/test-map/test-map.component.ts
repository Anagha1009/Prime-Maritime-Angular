import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IgxSizeScaleComponent, IgxValueBrushScaleComponent, MarkerType } from 'igniteui-angular-charts';
import { IgxShapeDataSource } from 'igniteui-angular-core';
import { IgxGeographicMapComponent, IgxGeographicProportionalSymbolSeriesComponent } from 'igniteui-angular-maps';
import { WorldLocations } from 'src/app/models/map';
import { TestmapService } from 'src/app/services/testmap.service';


@Component({
  selector: 'app-test-map',
  templateUrl: './test-map.component.html',
  styleUrls: ['./test-map.component.scss']
})
export class TestMapComponent implements OnInit {
  locations: [''];
 

  @ViewChild("map", { static: true })
  public map: IgxGeographicMapComponent;
  @ViewChild("template", { static: true })
  public tooltipTemplate: TemplateRef<object>;


  constructor(private _testmapService: TestmapService,
    private route: ActivatedRoute,
    private _router: Router) { }

  ngOnInit(): void {

    const sds = new IgxShapeDataSource();
    sds.importCompleted.subscribe(() => this.onDataLoaded(sds, ""));
    sds.shapefileSource = "https://static.infragistics.com/xplatform/shapes/WorldTemperatures.shp";
    sds.databaseSource = "https://static.infragistics.com/xplatform/shapes/WorldTemperatures.dbf";

    sds.dataBind();
  }

  public onDataLoaded(sds: IgxShapeDataSource, e: any) {
    const shapeRecords = sds.getPointData();
    // console.log("loaded contour shapes: " + shapeRecords.length + " from /Shapes/WorldTemperatures.shp");

    const contourPoints: any[] = [];
    for (const record of shapeRecords) {
      const temp = record.fieldValues.Contour;
      // using only major contours (every 10th degrees Celsius)
      if (temp % 10 === 0 && temp >= 0) {
        for (const shapes of record.points) {
          for (let i = 0; i < shapes.length; i++) {
            if (i % 5 === 0) {
              const p = shapes[i];
              const item = { lon: p.x, lat: p.y, value: temp };
              contourPoints.push(item);
            }
          }
        }
      }
    }
    this.addSeriesWith(WorldLocations.getAll());

  }


  public addSeriesWith(locations: any[]) {
    const sizeScale = new IgxSizeScaleComponent();
    sizeScale.minimumValue = 4;
    sizeScale.maximumValue = 60;

    const brushes = [
      "rgba(14, 194, 14, 0.4)",  // semi-transparent green
      "rgba(252, 170, 32, 0.4)", // semi-transparent orange
      "rgba(252, 32, 32, 0.4)"  // semi-transparent red
    ];

    const brushScale = new IgxValueBrushScaleComponent();
    brushScale.brushes = brushes;

    brushScale.minimumValue = 0;
    brushScale.maximumValue = 30;
    const symbolSeries = new IgxGeographicProportionalSymbolSeriesComponent();
    symbolSeries.dataSource = locations;
    symbolSeries.markerType = MarkerType.Circle;
    symbolSeries.radiusScale = sizeScale;
    symbolSeries.fillScale = brushScale;
    
    // symbolSeries.fillMemberPath="\...\...\...\src\assets\img\blink.gif";
    symbolSeries.fillMemberPath = "pop";
    symbolSeries.radiusMemberPath = "pop";
    symbolSeries.latitudeMemberPath = "lat";
    symbolSeries.longitudeMemberPath = "lon";
    symbolSeries.markerOutline = "rgba(0,0,0,0.3)";
    symbolSeries.tooltipTemplate = this.tooltipTemplate;

    this.map.series.add(symbolSeries);
  }


}
